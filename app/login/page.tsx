"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { isAdminAuthenticated, loginAdmin } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(4, "Mot de passe obligatoire"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "lawanifadil8@gmail.com",
      password: "",
    },
  });

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError("");
      setLoading(true);

      await loginAdmin(values);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de se connecter. Vérifiez vos identifiants."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden items-center justify-center border-r bg-white px-10 lg:flex">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl bg-black p-6 shadow-xl shadow-orange-500/15 ring-1 ring-black/10">
            <Image
              src="/sporthub-logo.png"
              alt="Logo SportHub"
              width={288}
              height={288}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <h1 className="mt-8 text-4xl font-bold text-zinc-950">
            SportHub Admin
          </h1>

          <p className="mt-3 text-sm font-medium text-zinc-500">
            Gestion de la plateforme
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-black p-2 shadow-lg shadow-orange-500/15">
              <Image
                src="/sporthub-logo.png"
                alt="Logo SportHub"
                width={96}
                height={96}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl font-bold text-foreground">
              SportHub Admin
            </h1>
          </div>

          <Card className="bg-white shadow-xl shadow-black/5">
            <CardHeader className="space-y-2 pb-2">
              <div className="mb-2 h-1 w-14 rounded-full bg-primary" />
              <CardTitle className="text-2xl">
                Connexion administrateur
              </CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder au tableau de bord.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse email</label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="lawanifadil8@gmail.com"
                      className="h-12 pl-11"
                      {...form.register("email")}
                    />
                  </div>

                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot de passe</label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Votre mot de passe"
                      className="h-12 pl-11"
                      {...form.register("password")}
                    />
                  </div>

                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
