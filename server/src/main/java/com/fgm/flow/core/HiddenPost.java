package com.fgm.flow.core;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.FetchType;
import javax.persistence.EmbeddedId;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Embeddable;

/**
 * Hidden post keeps track of whether a user wants to hide, or ignore, a post
 *
 * @author fgm
 */
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(name="hiddenpost")
public class HiddenPost
{
    @Getter
    @Setter
    @EmbeddedId
    private HiddenPostId id;
    
    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    private User user;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId")
    private Post post;

    @Getter
    @Setter
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    private HiddenPost()
    {
    }
    
    public HiddenPost(User user, Post post)
    {
        this.user = user;
        this.post = post;
        this.id = new HiddenPostId(user.getId(), post.getId());
        this.time = new Date();
    }

    @EqualsAndHashCode(of = {"userId", "postId"})
    @Embeddable
    public static class HiddenPostId implements Serializable
    {
        @Getter
        @Column(name = "userId")
        private int userId;

        @Getter
        @Column(name = "postId")
        private int postId;

        private HiddenPostId()
        {
        }
        
        public HiddenPostId(int userId, int postId)
        {
            this.userId = userId;
            this.postId = postId;
        }
    }
}