"use client";

import { UserButton } from "@clerk/nextjs";

interface Props {
  showName?: boolean;
}

export const UserControl = ({ showName }: Props) => {
  return (
    <UserButton
      showName={showName}
      appearance={{
        elements: {
          userButtonBox: "rouded-md!",
          userButtonAvatarBox: "rounded-md! size-8!",
          userButtonTrigger: "rounded-md!"
        },
      }}
    />
  );
};