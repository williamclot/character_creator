import React, { useRef, FC, useState } from 'react';
import cn from 'classnames';
import { Dialog } from '@material-ui/core';

import styles from './SharePopup.module.scss';

interface Props {
    url: string;
    title: string;
    description: string;
    open: boolean;
    onClose: () => void;
}

const SharePopup: FC<Props> = ({ url, title, description, open, onClose }) => {
    const urlInputRef = useRef<HTMLInputElement>(null);

    const [isCopied, setCopied] = useState(false);

    const handleCopy = () => {
        if (urlInputRef.current) {
            urlInputRef.current.select();
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1500);
        }
    };

    const encodedUrl = encodeURIComponent(url);

    const shareLinks = [
        {
            title: 'Share on Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: <i className="fa fa-facebook-official" />,
            brandClass: styles.facebook,
        },
        {
            title: 'Share on Twitter',
            url: `https://twitter.com/intent/tweet?text=${encodedUrl}`,
            icon: <i className="fa fa-twitter" />,
            brandClass: styles.twitter,
        },
        {
            title: 'Share on Linkedin',
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`,
            icon: <i className="fa fa-linkedin" />,
            brandClass: styles.linkedin,
        },
        {
            title: 'Share on Reddit',
            url: `https://reddit.com/submit?url=${encodedUrl}`,
            icon: <i className="fa fa-reddit" />,
            brandClass: styles.reddit,
        },
        {
            title: 'Share on Pinterest',
            url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${title}&description=${description}`,
            icon: <i className="fa fa-pinterest" />,
            brandClass: styles.pinterest,
        },
        {
            title: 'Share on Tumblr',
            url: `http://www.tumblr.com/share?v=3&u=${encodedUrl}`,
            icon: <i className="fa fa-tumblr" />,
            brandClass: styles.tumblr,
        },
    ];

    return (
        <Dialog open={open} onClose={onClose}>
            <div className={styles.dialog}>
                <h2 className={styles.title} title="Share">
                    Share
                </h2>
                <button className={styles.closeButton} onClick={onClose}>
                    <i className="fa fa-close" />
                </button>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Social Networks</h3>
                    <ul className={styles.shareLinksList}>
                        {shareLinks.map((link, index) => (
                            <li
                                key={index}
                                className={styles.shareLinkListItem}
                            >
                                <a
                                title={link.title}
                                    className={cn(
                                        styles.shareLink,
                                        link.brandClass,
                                    )}
                                    href={link.url}
                                >
                                    {link.icon}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Link</h3>
                    <div className={styles.linkUrl}>
                        <input
                            className={styles.linkUrlInput}
                            ref={urlInputRef}
                            type="text"
                            title={url}
                            value={url}
                            readOnly
                        />
                        <button
                            className={styles.linkCopyButton}
                            onClick={handleCopy}
                        >
                            {isCopied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default SharePopup;
