import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import {
  useClosedConversation,
  useConversation,
  useSendMessage,
} from '@/hook/conversation.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageCircleOff, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MessageSchema = z.object({
  content: z.string().nonempty('Veuillez saisir un message'),
});

type FormMessage = z.infer<typeof MessageSchema>;

function Conversation() {
  const conversationId = localStorage.getItem('conversationId') as string;
  const { isLoading, data: conversation } = useConversation(conversationId);
  const mutationSendMessage = useSendMessage(conversationId);
  const mutationClosedConversation = useClosedConversation(conversationId);
  const messageForm = useForm<FormMessage>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(MessageSchema),
  });

  const handleSendMessage = (data: FormMessage) => {
    mutationSendMessage.mutate(data);
    messageForm.reset();
  };

  return (
    <div className='max-h-screen flex items-start justify-center bg-background p-4'>
      <div className='w-full max-w-[800px] space-y-6'>
        <Card>
          <CardHeader className='border-b pb-0'>
            <CardTitle className='flex items-center justify-between'>
              <span>Sujet : {conversation?.data?.conversation?.subject}</span>
              {conversation?.data?.conversation?.status === 'OPEN' && (
                <Button
                  variant='outline'
                  className='hover:bg-gray-300'
                  onClick={() => mutationClosedConversation.mutate()}
                >
                  <MessageCircleOff />
                  <span>Fermer</span>
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              <div className='flex justify-between items-center'>
                {conversation?.data?.conversation?.participants.map(
                  (participant: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-center space-x-2 border p-2.5 rounded-2xl'
                    >
                      <Avatar>
                        <AvatarImage
                          src={''}
                          alt={participant.firstName}
                          className='h-full w-full rounded-full'
                        />
                        <AvatarFallback className='text-muted-foreground'>
                          {participant.firstName.charAt(0) +
                            '' +
                            participant.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          {participant.firstName + ' ' + participant.lastName}
                        </p>
                        <p className='text-sm font-medium text-muted-foreground'>
                          {participant.email}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className='max-h-[50vh] overflow-auto'>
            {conversation?.data?.messages?.map((message) => (
              <div
                key={message._id}
                className='space-y-1  bg-gray-100 p-4 rounded-md mb-2.5'
              >
                <p className='text-sm text-dark text-justify rounded-md'>
                  {message.content}
                </p>
              </div>
            ))}
            {/* <p className='text-sm text-dark text-justify'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              eget massa eget libero lobortis congue. In ac nibh ut nisi
              pulvinar sagittis. Nullam placerat vestibulum nisl, ac pharetra
              elit aliquam sed. Nullam euismod, nisi eu mollis mattis, urna
              tellus imperdiet dui, eu rutrum tortor ligula eu orci. Fusce a
              quam a dolor sagittis vestibulum. Fusce a quam a dolor sagittis
              vestibulum. Fusce a quam a dolor sagittis vestibulum. Fusce a quam
              a dolor sagittis vestibulum. Fusce a quam a dolor sagittis
              vestibulum. Fusce a quam a dolor sagittis vestibulum.
            </p>
            <p className='text-sm text-secondary text-justify bg-primary p-4 rounded-md'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              eget massa eget libero lobortis congue. In ac nibh ut nisi
              pulvinar sagittis. Nullam placerat vestibulum nisl, ac pharetra
              elit aliquam sed. Nullam euismod, nisi eu mollis mattis, urna
              tellus imperdiet dui, eu rutrum tortor ligula eu orci. Fusce a
              quam a dolor sagittis vestibulum. Fusce a quam a dolor sagittis
              vestibulum. Fusce a quam a dolor sagittis vestibulum. Fusce a quam
              a dolor sagittis vestibulum. Fusce a quam a dolor sagittis
              vestibulum. Fusce a quam a dolor sagittis vestibulum.
            </p>
            <p className='text-sm text-dark text-justify bg-gray-100 p-4 rounded-md'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              eget massa eget libero lobortis congue. In ac nibh ut nisi
              pulvinar sagittis. Nullam placerat vestibulum nisl, ac pharetra
              elit aliquam sed. Nullam euismod, nisi eu mollis mattis, urna
              tellus imperdiet dui, eu rutrum tortor ligula eu orci. Fusce a
              quam a dolor sagittis vestibulum. Fusce a quam a dolor sagittis
              vestibulum. Fusce a quam a dolor sagittis vestibulum. Fusce a quam
              a dolor sagittis vestibulum. Fusce a quam a dolor sagittis
              vestibulum. Fusce a quam a dolor sagittis vestibulum.
            </p> */}
          </CardContent>
          <CardFooter>
            {conversation?.data?.conversation?.status === 'OPEN' && (
              <Form {...messageForm}>
                <form
                  onSubmit={messageForm.handleSubmit(handleSendMessage)}
                  className='space-y-4 w-full'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex-1/2'>
                      <FormField
                        control={messageForm.control}
                        name='content'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={1}
                                placeholder='Message'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type='submit'
                      disabled={messageForm.formState.isSubmitting}
                    >
                      {messageForm.formState.isSubmitting ? (
                        <Loader2 className='animate-spin' />
                      ) : (
                        <Send className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default withDashboard(Conversation);
