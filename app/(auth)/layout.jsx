import Navigationbar from "../components/Navbar";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }) {
  return (
    <>
      <Navigationbar />
      {children}
    </>
  );
}
