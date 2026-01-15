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
                    <h1>Deal Invitation</h1>
                    <p><strong>${user.email}</strong> wants to start a secure escrow transaction with you.</p>
                    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>${title}</h3>
                        <p>${description || 'No description provided.'}</p>
                        <p><strong>Amount:</strong> ${currency} ${amount}</p>
                    </div>
                    <p>To accept this deal securely, verify your identity, and get paid:</p>
                    <a href="${inviteLink}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View & Accept Deal</a>
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">This link expires in 7 days.</p>
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
