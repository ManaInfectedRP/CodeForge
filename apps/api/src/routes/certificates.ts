import { Router } from 'express';
import type { CertificateVerificationDto } from '@codeforge/shared';
import { prisma } from '../lib/prisma.ts';
import { h } from '../lib/helpers.ts';

export const certificatesRouter = Router();

/** Public: anyone scanning the QR code can confirm a certificate is genuine. */
certificatesRouter.get(
  '/:code',
  h(async (req, res) => {
    const cert = await prisma.certificate.findUnique({
      where: { verificationCode: req.params.code },
      include: {
        user: { select: { username: true } },
        course: { include: { path: true } },
      },
    });

    if (!cert) {
      const body: CertificateVerificationDto = { valid: false };
      return res.status(404).json(body);
    }

    const body: CertificateVerificationDto = {
      valid: true,
      studentName: cert.user.username,
      courseTitle: cert.course.title,
      pathName: cert.course.path.name,
      issuedAt: cert.issuedAt.toISOString(),
      certificateId: cert.id,
    };
    res.json(body);
  })
);
