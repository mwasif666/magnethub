"use client";

import styles from "./BlogSidebarFilters.module.css";

export type BlogTagRow = {
  id: number;
  name: string;
  slug?: string;
};

type TagsProps = {
  tags: BlogTagRow[];
  activeTagId: number | null;
  onSelect: (id: number | null) => void;
};

const Tags = ({ tags, activeTagId, onSelect }: TagsProps) => {
  return (
    <div className={`${styles.filterBox} ${styles.mb30}`}>
      <h5 className={styles.sidebarTitle}>Tags</h5>
      {tags.length === 0 ? (
        <p className={styles.emptyHint}>No tags yet.</p>
      ) : (
        <div className={styles.tagCloud}>
          <button
            type="button"
            className={`${styles.tagPill} ${
              activeTagId === null ? styles.tagPillActive : ""
            }`}
            onClick={() => onSelect(null)}
          >
            All
          </button>
          {tags.map((tag) => {
            const isActive = activeTagId === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                className={`${styles.tagPill} ${
                  isActive ? styles.tagPillActive : ""
                }`}
                onClick={() => onSelect(tag.id)}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tags;
