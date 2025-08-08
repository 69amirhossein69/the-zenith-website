"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// Update guest information
export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Invalid National ID");
  }
  const updatedData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updatedData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}


export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}
//delete reservation
export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const guestBookings = await getBookings(session.user.guestId);
  const guesBookingIds = guestBookings.map((booking) => booking.id);
  if (!guesBookingIds.includes(bookingId))
    throw new Error("Unauthorized booking deletion");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) throw new Error("Booking could not be deleted");
  revalidatePath("/account/reservations");
}

//update reservation
export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  const reservationId = Number(formData.get("reservationId"));

  const guestBookings = await getBookings(session.user.guestId);
  const guesBookingIds = guestBookings.map((booking) => booking.id);
  if (!guesBookingIds.includes(reservationId))
    throw new Error("Unauthorized booking update");

  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations").slice(0, 500);
  const updatedData = { numGuests, observations };

  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", reservationId)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated");

  revalidatePath(`/account/reservations/edit/${reservationId}`);
  revalidatePath(`/account/reservations`);
  redirect(`/account/reservations`);
}

//sign in and sign out actions
export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
