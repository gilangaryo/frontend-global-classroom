import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuthGuard() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    return loading;
}
