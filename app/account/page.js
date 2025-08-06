import { auth } from "../_lib/auth";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth()
  const firstName = session.user.name?.split(" ")[0] || "Guest";
  console.log(session);
  
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome {firstName}! Access your reservations and account details here.
    </h2>
  );
}
