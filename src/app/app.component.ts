/**
 * @license MIT
 */

import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    IdentityModel,
    PostModel,
} from '../models';
import {
    ScuttlebotService,
} from '../providers';
import {
    Select,
} from '@ngxs/store';
import {
    Observable,
} from 'rxjs';
import {
    Router,
    NavigationEnd,
} from '@angular/router';
import { CurrentFeedSettings } from '../interfaces';
import { CurrentFeedSettingState } from '../states';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    public title: string = 'app';

    @Select((state: any) => state.posts.filter((item: PostModel) => !item.rootId))
    public posts!: Observable<PostModel[]>;

    @Select((state: any) => state.identities.filter((item: IdentityModel) => item.isSelf).pop())
    public self!: Observable<IdentityModel>;

    @Select(CurrentFeedSettingState)
    public currentFeedSettings?: Observable<CurrentFeedSettings>;

    public constructor(
        private sbot: ScuttlebotService,
        private router: Router,
    ) {}

    public debug() {
        // tslint:disable-next-line:no-debugger
        debugger;
    }

    public ngOnInit(): void {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

    public log(item: any) {
        // tslint:disable-next-line:no-console
        console.log(item);
    }

    public formatBlobUrl(id: string) {
        return `ssb://ssb/${id}`;
    }

    public async updateFeed() {
        await this.sbot.updateFeed();
    }
}
