import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page')) || 1; // 현재 페이지
  const pageSize = parseInt(searchParams.get('pageSize')) || 10; // 페이지 당 게시글 수
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "회원이 아닙니다." }), { status: 500 });
  }

  const userId = session.user.id;

  try {
    if (category == "myPosts") {
      const posts = await prisma.post.findMany({
        where: {
          authorId: userId,
        },
        orderBy: {
          createdAt: 'desc', // 날짜 최신순으로 정렬
        },
        include: {
          author: true,
          tags: true,
        },
        skip: (page - 1) * pageSize,  // 페이징 시작 위치
        take: pageSize,  // 페이지 당 게시글 수
      });
      const totalPosts = await prisma.post.count({ where: { authorId: userId } });  // 총 게시글 수
      return new Response(JSON.stringify({ posts, totalPosts }), { status: 200 });
    } else if(category == "myComments"){
      const posts = await prisma.comment.findMany({
        where: {
          authorId: userId,
        },
        orderBy: {
          createdAt: 'desc', // 날짜 최신순으로 정렬
        },
        include: {
          author: true,
          post: {
            include: {
              author: true,
            },
          },
        },
        skip: (page - 1) * pageSize,  // 페이징 시작 위치
        take: pageSize,  // 페이지 당 댓글 수
      });
      //console.log(posts);
      const totalPosts = await prisma.comment.count({ where: { authorId: userId } });  // 총 댓글 수
      return new Response(JSON.stringify({ posts, totalPosts }), { status: 200 });
    } else if(category == "sharedPosts"){
      const posts = await prisma.post.findMany({
        where: {
          viewers: {
            some: {
              id: userId, // 해당 사용자가 viewers에 포함된 게시글
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // 날짜 최신순으로 정렬
        },
        include: {
          author: true, // 게시글 작성자 정보 포함
          tags: true, // 게시글의 태그 포함
          comments: {
            include: {
              author: true, // 댓글 작성자 정보 포함
            },
          },
        },
        skip: (page - 1) * pageSize, // 페이징 처리
        take: pageSize, // 페이지당 게시글 수
      });
      const totalPosts = await prisma.post.count({
        where: {
          viewers: {
            some: {
              id: userId, // 해당 사용자가 viewers에 포함된 게시글
            },
          },
        },
      });
      return new Response(JSON.stringify({ posts, totalPosts }), { status: 200 });
    } else if(category == "myInfo"){
      console.log(userId);
      const posts = [];
      const account = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return new Response(JSON.stringify({ posts, account }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "서버에서 게시글을 가져오는 중 문제가 발생했습니다." }), { status: 500 });
  }
}
