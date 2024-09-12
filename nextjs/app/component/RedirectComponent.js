import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RedirectComponent() {
    const session = await getServerSession();
    if (session){
        redirect('/');
    }

    return null;
}