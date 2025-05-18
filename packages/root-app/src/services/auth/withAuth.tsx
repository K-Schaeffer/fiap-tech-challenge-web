import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace("/");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return null; // Or a loading spinner
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
