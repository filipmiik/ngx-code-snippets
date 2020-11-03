import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { gsap, Power3 } from 'gsap/all';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '',
  styles: []
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        switchMap(() => this.route.fragment),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(frag => {
        const id = '#' + frag.trim();

        if (typeof frag === 'string' && id.length > 1) {
          const fragElement = document.getElementById(frag);

          if (fragElement !== null) {
            /*
            Variables:
            - 0.81: Minimal scroll duration
            - 2000: If smaller, scroll duration is longer; If bigger, scroll duration is shorter
            - Power3.easeOut: Easing function from GSAP library
            */
            gsap.to(window, {
              duration: Math.max(0.81, Math.log((fragElement.offsetTop - window.scrollY) / 2000)),
              scrollTo: id,
              ease: Power3.easeOut
            });
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
