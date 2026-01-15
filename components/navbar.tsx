import { createClient } from "@/utils/supabase/server";
import { NavbarClient } from "@/components/navbar-client";

export async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let initials = "U";
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        if (profile?.full_name) {
            initials = profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        } else if (user.user_metadata?.full_name) {
            initials = user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        }
    }

    return <NavbarClient user={user} initials={initials} />;
}
