import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "admin",
      },
    });

    return NextResponse.json({ message: "Admin created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating admin user" },
      { status: 500 }
    );
  }
}
