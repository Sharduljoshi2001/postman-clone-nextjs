import { NextRequest, NextResponse } from "next/server";
import { requestSchema } from "../../../src/validators/requestValidator";
import * as requestService from "../../../src/services/requestService";
//handling the POST request from the frontend
export async function POST(req: NextRequest) {
  try {
    //parsing the json body from request
    const body = await req.json();
    //step 1:validation layer
    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Validation Error",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }
    const validatedData = validationResult.data;
    //step 2:service layer (business logic)
    const result = await requestService.executeRequest(validatedData);
    //step 3:sending success response
    return NextResponse.json(
      {
        status: "success",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
