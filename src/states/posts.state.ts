/**
 * @license MIT
 */

import {
    Action,
    State,
    StateContext,
} from '@ngxs/store';

import {
    SetIdentity,
    UpdatePost,
} from '../actions';
import {
    PostModel,
} from '../models';

@State<PostModel[]>({
    name: 'posts',
    defaults: [],
})
export class PostsState {
    @Action(UpdatePost)
    public updatePost(ctx: StateContext<PostModel[]>, action: UpdatePost) {
        const state = ctx.getState();
        let post: PostModel;
        const postExists = state
            .filter(item => item.id === action.post.id)
            .length > 0;
        let newPost: boolean = false;

        if (!postExists) {
            post = new PostModel();
            Object.assign(post, action.post);
            newPost = true;
        } else {
            post = state
                .filter(item => item.id === action.post.id)[0];

            Object.assign(post, action.post);
        }

        // first check if the post is a comment and has a root in the state
        if (typeof post.rootId === 'string') {
            const root = state
                .filter(item => item.id === post.rootId)
                .pop();

            if (root instanceof PostModel && root.comments.filter(item => item.id === post.id).length === 0) {
                root.comments.push(post);
                root.comments.sort((a, b) => {
                    return a.date.getTime() - b.date.getTime();
                });
            }
        } else {
            // also check if this post has comments
            const comments = state.filter(item => item.rootId === post.id);

            if (comments.length > 0) {
                post.comments = [
                    ...comments,
                ].sort((a, b) => {
                    return a.date.getTime() - b.date.getTime();
                });
            }
        }

        if (newPost) {
            ctx.setState([
                ...state,
                post,
            ].sort((a, b) => {
                return b.latestActivity.getTime() - a.latestActivity.getTime();
            }));
        } else {
            ctx.setState([
                ...state,
            ].sort((a, b) => {
                return b.latestActivity.getTime() - a.latestActivity.getTime();
            }));
        }
    }

    @Action(SetIdentity)
    public setIdentity(ctx: StateContext<PostModel[]>, action: SetIdentity) {
        const state = ctx.getState();
        state
            .filter(item => item.authorId === action.identity.id)
            .forEach(item => {
                item.author = action.identity;
            });

        ctx.setState([
            ...state,
        ]);
    }
}
