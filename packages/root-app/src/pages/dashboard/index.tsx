import { useAuth } from "@/services/auth/AuthContext";
import { AccountCircle } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { FButton, FHeader, FMenuDropdown } from "components";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const DashboardApp = dynamic(() => import("dashboardApp/Index"), {
  ssr: false,
});

export default function RootViewDashboard() {
  const fullName: string = "Joana da Silva Oliveira";
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Bytebank | Dashboard</title>
        <meta name="description" content="By FIAP Tech Challenge" />
      </Head>
      <FHeader
        leftContent={
          <Box>
            <FMenuDropdown
              options={{ sx: { display: { xs: "flex", lg: "none" } } }}
            >
              <Link href="" />
            </FMenuDropdown>
          </Box>
        }
        rightContent={
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">{fullName}</Typography>
            <Link href={"/"} style={{ display: "flex" }}>
              <AccountCircle color="secondary" sx={{ fontSize: 40 }} />
            </Link>
            <FButton
              innerText="Sair"
              options={{
                variant: "text",
                color: "secondary",
                size: "small",
              }}
              onClick={handleLogout}
            />
          </Box>
        }
      />
      <DashboardApp />
    </>
  );
}
