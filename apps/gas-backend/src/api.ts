export async function api_hello() {
  return {
    success: true,
    data: {
      message: "Hello from gas-backend!"
    }
  }
}