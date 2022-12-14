import prisma from './prisma-client'
import { nonce } from '@utilities/encryption/utilities'

export default class User {
  static async update(userId, data) {}

  static async create(userId) {
    return await prisma.user.create({
      data: {
        userId,
        challenge: nonce(),
      },
    })
  }

  static async delete(userId) {
    return await prisma.user.delete({ where: { userId } })
  }

  static async get(userId) {
    if (!userId) return undefined
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        attestations: true,
        memberStats: true,
        deployerProfile: true,
      },
    })

    if (!user) return undefined

    user.apps = {
      memberStats: user.memberStats.length,
      deployerProfile: user.deployerProfile.length,
    }

    return user
  }
}
