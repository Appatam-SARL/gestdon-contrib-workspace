import ConversationApi from '@/api/conversation.api';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

// get a conversation
export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => ConversationApi.getConversation(id),
  });
}

// create a conversation
export function useCreateConversation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: any) => ConversationApi.createConversation(data),
    onMutate: () => {
      toast({
        title: 'Création de la conversation...',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      localStorage.setItem('conversationId', data.data._id);
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
      toast({
        title: 'Conversation créée',
        description: 'Merci de patienter...',
        duration: 5000,
      });
      navigate(`/conversation/${data._id}`);
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la création de la conversation',
        description: error.message,
        duration: 5000,
      });
    },
  });
}

// send a message
export function useSendMessage(conversationId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      ConversationApi.sendMessage(conversationId, data),
    onMutate: () => {
      toast({
        title: 'Envoi du message...',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
      toast({
        title: 'Message envoyé',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de l envoi du message',
        description: error.message,
        duration: 5000,
      });
    },
  });
}

export function useClosedConversation(conversationId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['closed-conversation'],
    mutationFn: () => ConversationApi.closeConversation(conversationId),
    onMutate: () => {
      toast({
        title: 'Conversation fermée...',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
      toast({
        title: 'Conversation fermée',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la fermeture de la conversation',
        description: error.message,
        duration: 5000,
      });
    },
  });
}
