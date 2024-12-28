"use server";

export async function checkAuthorizationKey(token: string | null) {
  if (!token)
    return { success: false, error: "Authorization header is required." };

  const args = token.split(" ");
  if (args[0].toLowerCase() !== "bearer")
    return { success: false, error: "Invalid Authorization prefix" };

  const authorizationKey = process.env.POSTGRES_PASSWORD;
  if (args[1] !== authorizationKey)
    return { success: false, error: "Invalid Authorization key" };

  return { success: true };
}
