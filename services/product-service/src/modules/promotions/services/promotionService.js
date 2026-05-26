import prisma from '../../../db/prisma.js';

export function listPromotions() {
  return prisma.promotion.findMany({
    include: { products: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPromotionById(id) {
  return prisma.promotion.findUnique({
    where: { id },
    include: { products: true },
  });
}

export function createPromotion(data) {
  return prisma.promotion.create({
    data: {
      code: data.code,
      description: data.description,
      percentOff: data.percentOff,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      products: {
        create: (data.productIds || []).map((productId) => ({ productId })),
      },
    },
    include: { products: true },
  });
}

export function deletePromotion(id) {
  return prisma.promotion.delete({ where: { id } });
}


//parametry interpolowane przez prisme(queryRaw)
export async function activePromotionsAt(date) {
  return prisma.$queryRaw`
    SELECT id, code, percent_off AS "percentOff", starts_at AS "startsAt", ends_at AS "endsAt"
    FROM promotions
    WHERE starts_at <= ${date} AND ends_at >= ${date}
    ORDER BY percent_off DESC
  `;
}
