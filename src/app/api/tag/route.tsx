import prisma from "@/app/data";
import { NextResponse, NextRequest } from "next/server";


export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { name, image, description, user} = body;
        console.log("the user info", user)

        const result = await prisma.tag.create({ 
            data: {
                name,
                image,
                description,
                author: {
                    connect: {
                        email: user.email
                    }
                }
            }
        })
        // console.log("this is the result content", result)
        return NextResponse.json({ result })
    } catch (err) {
     return NextResponse.json({message: "POST Error", err}, {status: 500})   
    }
}

export const GET = async (req: NextRequest) => {
    try {

        // Convert the URL string to a URL object
        const url = new URL(req.url);
        
        // Extract the userEmail from the search parameters
        const userEmail = url.searchParams.get('userEmail');

        // using the email get the ID from the user
        if(userEmail != null){
          const user = await prisma.user.findUnique({
            where: {
              email: userEmail
            },
            include: {
                tags: true
            }
          });
          console.log("the content of get user with tags: ", user)

          return NextResponse.json(user)
        }
        
    } catch (err) {
        console.error("Error GETing tags", err);
        return NextResponse.json({message: "GET Error", err}, {status: 500})
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { id } = body;

        const result = await prisma.tag.delete({
            where: {
                id
            }
        })
        return NextResponse.json({ result })
    } catch (err) {
        return NextResponse.json({message: "DELETE Error for deleting a tag", err}, {status: 500})
    }
}