
export async function GET() {
  const url = process.env.TARGET_ENDPOINT;

  if (!url){
    return new Response(JSON.stringify({
        success: false,
        message: "TARGET_ENDPOINT not defined"
    }), {
        status: 500,
    });
  }

  try{
    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify({
        success: true,
        message: "Ping successful", data
    }), {
        status: 200,
    });
  }catch (error){
    return new Response(JSON.stringify({
        success: false,
        message: "Ping failed", error
    }), {
        status: 500,
    });
  }
}
