import { HttpAuthService } from "@/services/auth/HttpAuthService";
import { Box, Container, Typography } from "@mui/material";
import { FAlert, FButton, FInput } from "components";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const authService = useMemo(() => new HttpAuthService(), []);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [authService, router]);

  const handleSubmit = async () => {
    setError("");

    try {
      await authService.login(email, password);
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setError("Credenciais inválidas");
      setAlertOpen(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Seja bem-vindo(a) de volta!
        </Typography>
        {error && (
          <FAlert
            severity="error"
            text={error}
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
            width: "100%",
          }}
        >
          <FInput
            options={{
              margin: "normal",
              id: "email",
              label: "Email",
              name: "email",
              autoComplete: "email",
              autoFocus: true,
              value: email,
            }}
            textposition="left"
            onChange={(e) => setEmail(e.target.value)}
          />
          <FInput
            options={{
              margin: "normal",
              name: "password",
              label: "Senha",
              type: "password",
              id: "password",
              autoComplete: "current-password",
              value: password,
            }}
            textposition="left"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <FButton
          innerText="Entrar"
          options={{
            fullWidth: true,
            variant: "contained",
            sx: { mt: 3, mb: 2 },
          }}
          onClick={handleSubmit}
        />
      </Box>
    </Container>
  );
}
