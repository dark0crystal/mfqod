import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "../../../../auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    // All claims for techadmin/admin (no postId)
    if (!postId) {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });
        if (!user || (user.role !== "TECHADMIN" && user.role !== "ADMIN")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        try {
            const claims = await prisma.claim.findMany({
                where: { temporaryDeletion: false },
                include: {
                    uploadedClaimPhotos: { select: { photoUrl: true } },
                    user: { select: { id: true, name: true, email: true } },
                    post: { select: { id: true, title: true } },
                },
                orderBy: { createdAt: "desc" },
            });
            const formattedClaims = claims.map((claim) => ({
                id: claim.id,
                postId: claim.postId,
                post: claim.post,
                claimTitle: claim.claimTitle,
                claimContent: claim.claimContent,
                approval: claim.approved,
                createdAt: claim.createdAt,
                userId: claim.userId,
                user: claim.user,
                images: claim.uploadedClaimPhotos.map((p) => p.photoUrl),
            }));
            return NextResponse.json(formattedClaims);
        } catch (error) {
            console.error("Error fetching all claims:", error);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        }
    }

    // Claims for a specific post
    try {
        const claims = await prisma.claim.findMany({
            where: {
                postId,
                temporaryDeletion: false,
            },
            include: {
                uploadedClaimPhotos: { select: { photoUrl: true } },
                user: { select: { id: true, name: true, email: true } },
            },
        });

        if (!claims || claims.length === 0) {
            return new Response("No claims found", { status: 404 });
        }

        const formattedClaims = claims.map((claim) => ({
            id: claim.id,
            claimTitle: claim.claimTitle,
            claimContent: claim.claimContent,
            approval: claim.approved,
            createdAt: claim.createdAt,
            userId: claim.userId,
            user: claim.user,
            images: claim.uploadedClaimPhotos.map((photo) => photo.photoUrl),
        }));

        return NextResponse.json(formattedClaims);
    } catch (error) {
        console.error("Error fetching claims:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
