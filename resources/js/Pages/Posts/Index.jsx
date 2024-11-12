import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function Index({ auth, posts }) {

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        body: ''
    });

    const page = usePage();

    useEffect(() => {
        if(page?.props?.message?.body) {
            toast(page.props.message.body,{
                type: page.props.message.type,
                position: "top-right"
            });
        }
    },[page.props.message])

    function submit(e) {
        e.preventDefault()
        post(route('posts.store'), {
            onSuccess: () => {
                reset("body");
                // toast.success('Post Created Successfully', {
                //     position: "top-right"
                // })
            },
        });
    }

    function refreshPosts() {
        router.visit(route('posts.index'), {
            only : ['posts'],
            preserveScroll: true
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Post
                </h2>
            }
        >
            <Head title="Posts">
                <meta name="description" content="Posts Index" />
            </Head>

            <div className="py-12">
                <div className="mx-auto space-y-3 max-w-7xl sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg"
                    >
                        <label htmlFor="body" className="sr-only">Body</label>
                        <textarea
                            onChange={e => setData('body', e.target.value)}
                            onFocus={()=>clearErrors('body')}
                            name="body"
                            id="body"
                            cols="30"
                            rows="5"
                            value={data.body}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        ></textarea>

                        {errors.body && <p className="text-red-500">{errors.body}</p>}

                        <button
                            disabled={processing}
                            type="submit"
                            className={`mt-2 bg-gray-700 px-4 py-2 rounded-md font-medium text-white  ${processing && 'opacity-50'}`}
                        >
                            Post
                        </button>
                    </form>
                    <div className="flex justify-center py-3">
                        <button
                        onClick={refreshPosts}
                        className="text-sm text-indigo-700"
                        type="button"
                        >
                            Refresh posts
                        </button>
                        {/* <Link
                        href={route('posts.index')}
                        only={['posts']}
                        className="text-sm text-indigo-700"
                        type="button"
                        >
                            Refresh posts
                        </Link> */}
                    </div>
                    {posts.data.map((post) => {
                        return (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div key={post.id} className="p-6 text-gray-900">
                                    <div className="font-semibold">
                                        {post.user.name}
                                    </div>
                                    <p className="mt-1">{post.body}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
