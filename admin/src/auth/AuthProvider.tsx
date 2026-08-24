import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signIn,
  signOut,
} from "aws-amplify/auth";

import {
  AuthContext,
  type AuthContextValue,
  type AuthUser,
} from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

const getAuthUser = async (): Promise<AuthUser> => {
  const currentUser = await getCurrentUser();
  const attributes = await fetchUserAttributes();
  const session = await fetchAuthSession();

  const groups =
    (session.tokens?.idToken?.payload["cognito:groups"] as
      string[] | undefined) ?? [];

  const role = groups.includes("admin")
    ? "admin"
    : groups.includes("manager")
      ? "manager"
      : null;

  if (!role) {
    throw new Error("User does not have a Team Bayou role.");
  }

  return {
    userId: currentUser.userId,
    username: currentUser.username,
    email: attributes.email,
    role,
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await getAuthUser();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setError(null);

      try {
        await signIn({
          username: email.trim(),
          password,
        });

        await refresh();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unable to sign in.");

        setError(error);
        throw error;
      }
    },
    [refresh],
  );

  const handleSignOut = useCallback(async () => {
    setError(null);

    try {
      await signOut();
      setUser(null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unable to sign out.");

      setError(error);
      throw error;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const user = await getAuthUser();

        if (!cancelled) {
          setUser(user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      error,
      signIn: handleSignIn,
      signOut: handleSignOut,
      refresh,
    }),
    [user, isLoading, error, handleSignIn, handleSignOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
