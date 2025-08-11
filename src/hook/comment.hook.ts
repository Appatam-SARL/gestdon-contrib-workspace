import CommentApi from '@/api/comment.api';
import { useToast } from '@/components/ui/use-toast';
import { IComment } from '@/interface/comment.interafce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCreateComment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: Partial<IComment>) => {
      return await CommentApi.createComment(comment);
    },
    onMutate: () => {
      toast({
        title: 'En cours',
        description: 'Votre comment est en cours de création',
        duration: 5000,
      });
    },
    onSettled: () => {
      console.log('onSettled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Comment ajoutée',
        description: 'Votre commentaire a bien été posté merci',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useGetComments = () => {
  return useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      return await CommentApi.getComments();
    },
    enabled: false,
  });
};

export const useDeleteComment = () => {};

export const useEditComment = () => {};

export const useGetComment = () => {};

export const useGetCommentByPostId = (postId: string) => {
  return useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      return await CommentApi.getCommentsByPostId(postId);
    },
    enabled: false,
    staleTime: Infinity, // 1 year
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      commentId,
      likeId,
    }: {
      commentId: string;
      likeId: string;
    }) => {
      return await CommentApi.likesComment(commentId, likeId);
    },
    onMutate: () => {
      toast({
        title: 'En cours',
        description: 'Votre comment est en cours de création',
        duration: 5000,
      });
    },
    onSettled: () => {
      console.log('onSettled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Comment ajoutée',
        description: 'Votre like a bien été posté merci',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useReplyComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      commentId,
      data,
    }: {
      commentId: string;
      data: Partial<IComment>;
    }) => {
      return await CommentApi.replyComment(commentId, data);
    },
    onMutate: () => {
      toast({
        title: 'En cours',
        description: 'Votre comment est en cours de création',
        duration: 5000,
      });
    },
    onSettled: () => {
      console.log('onSettled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Comment ajoutée',
        description: 'Votre commentaire a bien été posté merci',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        duration: 5000,
      });
    },
  });
};
