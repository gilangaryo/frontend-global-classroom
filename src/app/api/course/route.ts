import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // atau sesuai path kamu
import slugify from 'slugify';

export async function POST(req: Request) {
    const body = await req.json();
    const { title, category, description, price, digitalUrl, imageUrl } = body;


    try {
        // buat category jika belum ada
        let categoryRecord = await prisma.category.findUnique({
            where: { name: category },
        });

        if (!categoryRecord) {
            categoryRecord = await prisma.category.create({
                data: { name: category },
            });
        }

        const course = await prisma.course.create({
            data: {
                title,
                slug: slugify(title, { lower: true }),
                description,
                price: parseFloat(price),
                digitalUrl,
                imageUrl,
                categoryId: categoryRecord.id,
            },
        });

        return NextResponse.json(course, { status: 201 });
    } catch (err) {
        console.error("Error creating course:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });

        return NextResponse.json(courses);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}