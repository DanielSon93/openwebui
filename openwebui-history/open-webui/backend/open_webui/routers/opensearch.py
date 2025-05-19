import aiohttp
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/query/opensearch")
async def send_opensearch_query(request: Request):
  body = await request.json()
  query = body.get("query")

  try:
    async with aiohttp.ClientSession() as session:
      await session.post(
          "http://host.docker.internal:8001/query",
          json=query,
          headers={"Content-Type": "application/json"},
      )
  except Exception as e:
      print("Error sending to other backend:", e)

  return {"status": "성공적으로 처리되었습니다."}