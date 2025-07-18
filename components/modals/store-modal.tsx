"use client"
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateStore } from "@/app/actions/store";
import toast from "react-hot-toast";
import { Store } from "@prisma/client";


const formSchema = z.object({
    name: z.string().nonempty("Store name is required"),
})
interface resInterface {
    message?: string,
    error?: string,
    store?: Store
}


export default function StoreModal() {
    const [loading, setLoading] = useState(false);
    const storeModal = useStoreModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            const res = await CreateStore(values.name);
            //const res = await axios.post('/api/stores', { name: values.name });
            //const res=await axios.post()
            console.log(res);
            if (res?.error) {
                throw new Error(res.error)
            }
            // toast.success(res.message||"");
            // form.reset();
            // storeModal.onClose();

            window.location.assign(`/${(res as resInterface).store?.id}`)



        }
        catch (e: unknown) {
            const message = e instanceof Error
                ? e.message
                : "Something went wrong.";


            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    }
    return <Modal
        title="Create Store"
        description="Add a new store to manage products and categories"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        <div>
            <div className="space-y-4 py-2 pb-4">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="E-commerce Store"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />
                        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                            <Button disabled={loading} variant={"outline"} onClick={storeModal.onClose}>Cancel</Button>
                            <Button disabled={loading} type="submit">Continue</Button>

                        </div>




                    </form>

                </Form>
            </div>
        </div>

    </Modal>
}