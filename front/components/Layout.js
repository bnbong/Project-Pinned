import NavBar from "./NavBar";

export default function Layout({ children, cookie }) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
