'use server'

import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Define consistent state shape
export type DealFormState = {
    error?: string
    fieldErrors?: {
        title?: string[]
        description?: string[]
        role?: string[]
        counterpartyEmail?: string[]
        amount?: string[]
        currency?: string[]
    }
}

const CreateDealSchema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    role: z.enum(['buyer', 'seller']),
    counterpartyEmail: z.string().email("Invalid email address"),
    amount: z.coerce.number().positive("Amount must be positive"),
    currency: z.enum(['USD', 'EUR', 'USDC']),
})

export async function createDealAction(prevState: DealFormState, formData: FormData): Promise<DealFormState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // 1. Validate Form
    const validatedFields = CreateDealSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        role: formData.get('role'),
        counterpartyEmail: formData.get('counterparty_email'),
        amount: formData.get('amount'),
        currency: formData.get('currency'),
    })

    if (!validatedFields.success) {
        return { fieldErrors: validatedFields.error.flatten().fieldErrors }
    }

    const { title, description, role, counterpartyEmail, amount, currency } = validatedFields.data

    // 2. Handle File Upload (if present)
    const file = formData.get('file-upload') as File
    let attachmentUrl = null

    if (file && file.size > 0) {
        const bucketName = process.env.NEXT_PUBLIC_ESCROW_STORAGE_BUCKET || 'deal-attachments'
        const path = `${user.id}/${Date.now()}_${file.name}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(path, file)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { error: 'Failed to upload attachment: ' + uploadError.message }
        }

        // Construct public URL (or just keep path if private bucket, but usually we want a reference)
        attachmentUrl = path
    }

    try {
        // 3. Create Deal Record
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .insert({
                title,
                description,
                status: 'draft',
                initiator_id: user.id,
                amount,
                currency,
            })
            .select()
            .single()

        if (dealError) throw dealError

        // 4. Create Invitation
        const token = crypto.randomUUID()

        const { error: inviteError } = await supabase
            .from('deal_invitations')
            .insert({
                deal_id: deal.id,
                email: counterpartyEmail.toLowerCase(),
                token: token,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            })

        if (inviteError) throw inviteError

        // 5. Send Email via Resend
        const resendApiKey = process.env.resend_api
        if (resendApiKey) {
            const resend = new Resend(resendApiKey)
            const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/claim-invite?token=${token}`

            await resend.emails.send({
                from: 'Obviate Escrow <onboarding@resend.dev>',
                to: counterpartyEmail,
                subject: `You've been invited to a secure deal: "${title}"`,
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deal Invitation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Inter', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        
        <!-- Header -->
        <div style="background-color: #2e7d32; padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Obviate Escrow</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 32px;">
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #3f3f46;">
                Hello,
            </p>
            <p style="margin: 0 0 32px; font-size: 16px; line-height: 24px; color: #3f3f46;">
                <strong>${user.email}</strong> has invited you to participate in a secure transaction.
            </p>

            <!-- Deal Card -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #0f172a;">${title}</h2>
                <p style="margin: 0 0 16px; font-size: 14px; line-height: 22px; color: #64748b;">
                    ${description || 'No description provided.'}
                </p>
                <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; color: #64748b;">Transaction Amount</span>
                    <span style="font-size: 18px; font-weight: 700; color: #2e7d32;">${currency} ${parseFloat(String(amount)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center;">
                <a href="${inviteLink}" style="display: inline-block; background-color: #2e7d32; color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; transition: background-color 0.2s;">
                    View & Accept Deal
                </a>
            </div>
            
            <p style="margin: 32px 0 0; text-align: center; font-size: 13px; color: #94a3b8;">
                This secure link will expire in 7 days.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #18181b; padding: 24px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #71717a;">
                &copy; ${new Date().getFullYear()} Obviate Escrow. All rights reserved.
            </p>
            <p style="margin: 8px 0 0; font-size: 12px; color: #52525b;">
                Secure payments provided by <span style="color: #a1a1aa;">Coinbase Commerce</span> & Bank Transfers.
            </p>
        </div>
    </div>
</body>
</html>
                `
            })
        } else {
            console.warn('resend_api not found. Helper email skipped.')
        }

    } catch (err: any) {
        console.error('Deal Creation Error:', err)
        return { error: 'Failed to create deal: ' + err.message }
    }

    redirect('/dashboard')
}
