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
 * A user's membership in a group
 *
 * @author fgm
 */
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(name="membership")
public class Membership
{
    @Getter
    @Setter
    @EmbeddedId
    private MembershipId id;
    
    @Getter
    @Setter
    @ManyToOne(/*fetch = FetchType.LAZY*/)
    @MapsId("userId")
    private User user;

    @Getter
    @Setter
    @ManyToOne(/*fetch = FetchType.LAZY*/)
    @MapsId("userGroupId")
    private UserGroup userGroup;

    @Getter
    @Setter
    @Column(nullable=false)
    private int status;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    private Membership()
    {
    }
    
    public Membership(User user, UserGroup userGroup, int status)
    {
        this.user = user;
        this.userGroup = userGroup;
        this.id = new MembershipId(user.getId(), userGroup.getId());
        this.status = status;
        this.time = new Date();
    }

    @EqualsAndHashCode(of = {"userId", "userGroupId"})
    @Embeddable
    public static class MembershipId implements Serializable
    {
        @Getter
        @Column(name = "userId")
        private int userId;

        @Getter
        @Column(name = "userGroupId")
        private int userGroupId;

        private MembershipId()
        {
        }

        public MembershipId(int userId, int userGroupId)
        {
            this.userId = userId;
            this.userGroupId = userGroupId;
        }
    }
}