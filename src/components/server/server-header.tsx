'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/hooks/use-modal';
import { ServerWithMembersAndProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
interface ServerHeaderProps {
  server: ServerWithMembersAndProfiles;
  role?: MemberRole;
}

const ServerHeader = ({ role, server }: ServerHeaderProps) => {
  const { open } = useModal();
  const admin = role === MemberRole.ADMIN;
  const mod = admin || role === MemberRole.MOD;
  const member = role === MemberRole.GUEST;
  return (
    <>
      <DropdownMenu>
        {/* As child tells  the DropdownMenuTrigger component to treat the component nested within it ( Button in this case )  as the element responsible for actually rendering the trigger for the dropdown menu. */}
        <DropdownMenuTrigger asChild>
          <Button className="w-full">{server.name}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-55">
          {mod && (
            <DropdownMenuItem
              onClick={() => open('invite', { server })}
              className="px-3 py-2 cursor-pointer"
            >
              Invite
            </DropdownMenuItem>
          )}
          {admin && (
            <DropdownMenuItem
              className="px-3 py-2 cursor-pointer"
              onClick={() => open('serverSettings', { server })}
            >
              Settings
            </DropdownMenuItem>
          )}
          {mod && (
            <DropdownMenuItem
              className="px-3 py-2 cursor-pointer"
              onClick={() => open('createChannel', { server })}
            >
              Create channels
            </DropdownMenuItem>
          )}
          {admin && (
            <DropdownMenuItem
              className="px-3 py-2 cursor-pointer"
              onClick={() => open('manageMembers', { server })}
            >
              Manage members
            </DropdownMenuItem>
          )}
          {admin && (
            <DropdownMenuItem className="px-3 py-2 cursor-pointer text-rose-500">
              Delete server
            </DropdownMenuItem>
          )}
          {!admin && (
            <DropdownMenuItem
              className="px-3 py-2 cursor-pointer text-rose-500"
              onClick={() => open('leaveServer', { server })}
            >
              Leave server
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ServerHeader;
