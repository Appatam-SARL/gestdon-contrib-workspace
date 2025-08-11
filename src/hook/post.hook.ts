import PostsAPI from '@/api/post.api';
import { useToast } from '@/components/ui/use-toast';
import { IPost } from '@/interface/post.interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const usePosts = (filter?: any) => {
  return useQuery({
    queryKey: ['posts', ...((Object.values(filter) as string[]) ?? [])],
    queryFn: () => PostsAPI.getPosts(filter),
    staleTime: Infinity,
  });
};

export const usePostById = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => PostsAPI.getPostById(id),
    staleTime: Infinity,
  });
};

export const useCreatePost = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: any) => PostsAPI.createPost(post),
    onMutate: () => {
      toast({
        title: 'Création en cours',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Votre post a bien été créé, et est à present visible par tous',
        description: "Merci d'avoir partagé avec nous !",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la création',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });
};

export const useUpdatePost = (setOpenEditDialog: (val: boolean) => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: IPost) => await PostsAPI.updatePost(post),
    onMutate: () => {
      toast({
        title: 'Mise à jour en cours',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Votre post a bien été mis à jour',
        description: "Merci d'avoir partagé avec nous !",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setOpenEditDialog(false);
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la mise à jour',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
      setOpenEditDialog(true);
    },
  });
};

export const useDeletePost = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PostsAPI.deletePost(id),
    onMutate: () => {
      toast({
        title: 'Suppression en cours',
        description: 'Votre post est en cours de suppression',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Post supprimé',
        description: 'Votre post a été supprimé avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la suppression',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });
};

export const useLikePost = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: { userId: string };
    }) => {
      console.log('🚀 ~ useLikePost ~ data:', data);
      const post = PostsAPI.likePost(postId, data);
      return post;
    },
    onMutate: () => {
      toast({
        title: "J'aime en cours",
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      toast({
        title: "J'aime effectué",
        description: "Merci d'avoir partagé avec nous !",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la J'aime",
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });
};
