import { createClient } from '@/utils/supabase/server';
import WalletClient from '@/components/wallet/WalletClient';

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in.</div>;
    }

    // Parallel Fetches
    const [dealsRes, methodsRes] = await Promise.all([
        supabase.from('deals').select('*').or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`),
        supabase.from('user_payment_methods').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    const deals = dealsRes.data || [];
    const paymentMethods = methodsRes.data || [];

    // Calculate Balances
    const activeDeals = deals.filter(d => ['active', 'funding', 'funded', 'in_review', 'disputed'].includes(d.status));
    const completedDeals = deals.filter(d => d.status === 'completed');

    // 1. Locked: Amount in active deals (Funds I've put in OR funds destined for me but not released)
    const lockedFunds = activeDeals.reduce((sum, deal) => sum + Number(deal.amount), 0);

    // 2. Available: Completed deals where I am the recipient
    const availableFunds = completedDeals
        .filter(deal => deal.recipient_id === user.id)
        .reduce((sum, deal) => sum + Number(deal.amount), 0);

    const balance = {
        locked: lockedFunds,
        available: availableFunds,
        total: lockedFunds + availableFunds
    };

    return (
        <WalletClient
            balance={balance}
            paymentMethods={paymentMethods}
            transactions={activeDeals} // Showing active deals in "Recent" for now as they are the source of funds
        />
    );
}
