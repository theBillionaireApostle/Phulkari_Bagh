import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Expect the request body to include the new "published" status
    const { published } = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { published },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    let message = "Failed to toggle product";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
