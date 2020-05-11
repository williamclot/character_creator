import React, { FC } from 'react';
import cn from 'classnames';
import styles from './SocialMediaButtons.module.scss';
import sharedStyles from '../../shared-styles/basic-button.module.scss';

interface Props {
    url: string;
}

const SocialMediaButtons: FC<Props> = props => {
    const facebookUrl = `https://facebook.com/share.php?u=${props.url}`;
    const twitterUrl = `https://twitter.com/share?url=${props.url}`;
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${props.url}`;

    return (
        <>
            <a
                href={facebookUrl}
                title="Share on Facebook"
                className={cn(
                    sharedStyles.button,
                    styles.share,
                    styles.facebook,
                )}
            >
                <i className="fa fa-facebook" aria-hidden="true"></i>
            </a>
            <a
                href={twitterUrl}
                title="Share on Twitter"
                className={cn(
                    sharedStyles.button,
                    styles.share,
                    styles.twitter,
                )}
            >
                <i className="fa fa-twitter" aria-hidden="true"></i>
            </a>
            <a
                href={pinterestUrl}
                title="Share on Pinterest"
                className={cn(
                    sharedStyles.button,
                    styles.share,
                    styles.pinterest,
                )}
            >
                <i className="fa fa-pinterest" aria-hidden="true"></i>
            </a>
        </>
    );
};

export default SocialMediaButtons;
