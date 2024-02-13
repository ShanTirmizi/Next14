import { db } from '@/lib/db';
import { currentUser, redirectToSignUp } from '@clerk/nextjs';

export const Profile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignUp();
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
    },
  });

  return newProfile;
};
