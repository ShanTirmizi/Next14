'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from '@/components/user-avatar';
import { useModal } from '@/hooks/use-modal';
import { ServerWithMembersAndProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import {
  Check,
  Loader2,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MOD]: <ShieldCheck className="h-4 w-4" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-red-500" />,
};

const ManageMemberModal = () => {
  const router = useRouter();
  const { isOpen, close, type, data, open } = useModal();
  const [isLoadingId, setIsLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'manageMembers';

  const { server } = data as { server: ServerWithMembersAndProfiles };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setIsLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const res = await axios.patch(url, { role });
      router.refresh();
      open('manageMembers', { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingId('');
    }
  };

  const onRemoveMember = async (memberId: string) => {
    try {
      setIsLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });
      const res = await axios.delete(url);
      router.refresh();
      open('manageMembers', { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingId('');
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage member</DialogTitle>
            <DialogDescription>
              {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            {server?.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <UserAvatar src={member?.profile?.imageUrl} />
                  <div className="ml-2">
                    <div className="flex gap-x-1 items-center">
                      {member?.profile?.name}
                      {roleIconMap[member.role]}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {member?.profile?.email}
                    </p>
                  </div>
                </div>
                {server.profileId !== member.profileId &&
                  isLoadingId !== member.id && (
                    <div className="cursor-pointer">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                              <ShieldQuestion className="h-4 w-4" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className="flex justify-between cursor-pointer"
                                  onClick={() =>
                                    onRoleChange(member.id, MemberRole.GUEST)
                                  }
                                >
                                  Guest
                                  {member.role === MemberRole.GUEST && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex justify-between cursor-pointer"
                                  onClick={() =>
                                    onRoleChange(member.id, MemberRole.MOD)
                                  }
                                >
                                  Mod
                                  {member.role === MemberRole.MOD && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onRemoveMember(member.id)}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {isLoadingId === member?.id && (
                  <Loader2 className="animate-spin ml-auto" />
                )}
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageMemberModal;
