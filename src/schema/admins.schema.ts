import z from 'zod';

export const formAdminSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').nonempty('Email requis'),
  phone: z
    .string()
    .nonempty({ message: 'Numéro de téléphone requis' })
    .regex(/^\+225(01|05|07|27)[0-9]{8}$/, {
      message: 'Numéro de téléphone invalide',
    }),
  role: z.enum(['MANAGER', 'COORDINATOR', 'EDITOR', 'AGENT']),
  address: z.object({
    country: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    street: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    postalCode: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    city: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  }),
});

export const formInviteRegisterUserSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Le mot de passe doit contenir au moins 8 caractères et contenir au moins un chiffre, une lettre majuscule et une lettre minuscule.'
    )
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  address: z.object({
    country: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    street: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    postalCode: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    city: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  }),
});

// form add for invite
export const formInviteSchema = z.object({
  email: z.string().email('Email invalide'),
  role: z.enum(['MANAGER', 'COORDINATOR', 'EDITOR', 'AGENT']),
});

// Login schema
export const formLoginSchema = z.union([
  z.object({
    email: z
      .string()
      .email('Email invalide')
      .regex(/^\S+@\S+$/, 'Email invalide'),
    password: z
      .string()
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   'Le mot de passe doit contenir au moins 8 caractères et contenir au moins un chiffre, une lettre majuscule et une lettre minuscule.'
      // )
      .min(
        8,
        'Le mot de passe doit contenir au moins 8 caractères et contenir au moins un chiffre, une lettre majuscule et une lettre minuscule'
      ),
  }),
  z.object({
    phone: z.string().min(10, 'Numéro de téléphone invalide'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Le mot de passe doit contenir au moins 8 caractères et contenir au moins un chiffre, une lettre majuscule et une lettre minuscule.'
      )
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  }),
]);

// forget password schema
export const formForgetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

// reset password schema
export const formResetPasswordSchema = z.object({
  token: z.string().min(1, 'Le token est invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type FormInviteValues = z.infer<typeof formInviteSchema>;
export type FormAdminValues = z.infer<typeof formAdminSchema>;
export type FormLoginValues = z.infer<typeof formLoginSchema>;
export type FormForgetPasswordValues = z.infer<typeof formForgetPasswordSchema>;
export type FormResetPasswordValues = z.infer<typeof formResetPasswordSchema>;
export type FormInviteRegisterUserValues = z.infer<
  typeof formInviteRegisterUserSchema
>;
