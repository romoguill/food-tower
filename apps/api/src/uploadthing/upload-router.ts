import { createUploadthing, type FileRouter } from 'uploadthing/express';

const f = createUploadthing();

export const uploadRouter: FileRouter = {
  restaurantImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      return { uploadedBy: req.user?.sub ?? 'unknown' };
    })
    .onUploadComplete(({ file, metadata }) => {
      return { url: file.ufsUrl };
    }),
  menuItemImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      return { uploadedBy: req.user?.sub ?? 'unknown' };
    })
    .onUploadComplete(({ file, metadata }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
