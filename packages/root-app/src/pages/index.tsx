import { MENU_ITEMS_HOME } from "@/constants/menuItems";
import { Box } from "@mui/material";
import {
  FAccountButtons,
  FHeader,
  FMenuDropdown,
  FMenuList,
  FMenuListItem,
} from "components";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

const LandingApp = dynamic(() => import("landingApp/Index"), {
  ssr: false,
});

export const getStaticProps: GetStaticProps = async () => {
  const menuItems = MENU_ITEMS_HOME.map((item) => ({
    ...item,
    current: false,
  }));

  return {
    props: {
      menuItems,
    },
  };
};

interface RootViewProps {
  menuItems: FMenuListItem[];
}

export default function RootViewHome({ menuItems }: RootViewProps) {
  const handleNewAccount = () => {};
  const handleLogin = async () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Bytebank</title>
        <meta name="description" content="By FIAP Tech Challenge" />
      </Head>
      <FHeader
        maxWidth="lg"
        leftContent={
          <Box display="flex" alignItems="center" gap={8}>
            <Box
              sx={{
                display: { xs: "none", md: "none", lg: "flex" },
                userSelect: "none",
              }}
            >
              <Image
                src="/assets/logo.svg"
                alt="logo Bytebank"
                width={146}
                height={32}
              />
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex", lg: "none" },
                userSelect: "none",
              }}
            >
              <Image
                src="/assets/logo-small.svg"
                alt="logo Bytebank pequeno"
                width={27}
                height={27}
              />
            </Box>
            <FMenuDropdown
              menuItems={menuItems}
              options={{ sx: { display: { xs: "flex", md: "none" } } }}
            >
              <Link href="" />
            </FMenuDropdown>
            <FMenuList
              menuItems={menuItems}
              variant="row"
              options={{
                sx: { display: { xs: "none", md: "flex" }, fontWeight: 600 },
              }}
            >
              <Link href="" />
            </FMenuList>
          </Box>
        }
        rightContent={
          <Box>
            <FAccountButtons
              color="primary"
              options={{
                sx: {
                  display: { xs: "none", md: "flex" },
                },
              }}
              handleNewAccount={() => {
                handleNewAccount();
              }}
              handleLogin={() => {
                handleLogin();
              }}
            />
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                userSelect: "none",
              }}
            >
              <Image
                src="/assets/logo.svg"
                alt="logo Bytebank"
                width={146}
                height={32}
              />
            </Box>
          </Box>
        }
      />
      <LandingApp />
    </>
  );
}
