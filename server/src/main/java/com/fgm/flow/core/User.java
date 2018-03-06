package com.fgm.flow.core;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.UniqueConstraint;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.OneToMany;
import javax.persistence.FetchType;
import javax.persistence.CascadeType;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import com.google.gson.annotations.Expose;
import static java.lang.System.out;

/**
 * A Flow user
 *
 * @author fgm
 */
@NoArgsConstructor
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(
        name="user",
        uniqueConstraints = @UniqueConstraint(columnNames={"nick", "email"})
)
public class User implements Serializable
{
    @Id
    @Getter
    @Setter
    @Column(nullable=false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Expose
    private int id;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Expose
    private String email;
    
    @Setter
    @Getter
    @Column(nullable=false)
    @Size(min = 2, max = 25,
            message = "Nickname must be between 2 and 25 characters long")
    @Expose
    private String nick;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Expose
    private String password;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    @Expose
    private Date time;
    
    @OneToMany(mappedBy="poster", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
    @Setter
    @Getter
    private List<Post> posts;
    
    @OneToMany(mappedBy="user", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
    @Setter
    @Getter
    private List<Membership> memberships;
    
    @OneToMany(mappedBy="user", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
    @Setter
    @Getter
    private Set<HiddenPost> hiddenPosts;
    
    public boolean isMemberOfGroup(UserGroup userGroup)
    {
        if(userGroup == null)
        {
            return false;
        }
        
        boolean isMember = false;
        
        for(Membership membership : memberships)
        {
            if(membership.getUserGroup().equals(userGroup)
                && (membership.getStatus() == 0 || membership.getStatus() == 1)        
            )
            {
                return true;
            }
        }
        
        return false;
    }
    
    public boolean isOwnerOfGroup(UserGroup userGroup)
    {
        if(userGroup == null)
        {
            return false;
        }
        
        for(Membership membership : memberships)
        {
            if(membership.getUserGroup().equals(userGroup)
                    && membership.getStatus() == 0
            )
            {
                return true;
                
            }
        }
        
        return false;
    }
    
    public boolean isInvitedToGroup(UserGroup userGroup)
    {
        if(userGroup == null)
        {
            return false;
        }
        
        for(Membership membership : memberships)
        {
            if(membership.getUserGroup().equals(userGroup)
                    && membership.getStatus() == 2
            )
            {
                return true;
                
            }
        }
        
        return false;
    }
    
    public Integer getMembershipStatus(UserGroup userGroup)
    {
        if(userGroup == null)
        {
            return null;
        }
        
        for(Membership membership : memberships)
        {
            if(membership.getUserGroup().equals(userGroup))
            {
                return membership.getStatus();
                
            }
        }
        
        // Return null if the user doesn't have a membership status in the
        // given user group
        return null;
    }
    
    public boolean isHidingPost(Post post)
    {
        if(post == null)
        {
            return false;
        }
                
        return hiddenPosts.contains(new HiddenPost(this, post));
    }
    
    public List<UserGroup> getUserGroups()
    {
        List<UserGroup> userGroupList = new ArrayList<>(); 
        
        for(Membership membership : memberships)
        {
            userGroupList.add(membership.getUserGroup());
        }
        
        return userGroupList;
    }
    
    public User(String email, String nick, String password)
    {
        this.email = email;
        this.nick = nick;
        this.password = password;
        initialise();
    }
    
    public User(User user)
    {
        this.email = user.getEmail();
        this.nick = user.getNick();
        this.password = user.getPassword();
        initialise();
    }
    
    private final void initialise()
    {
        this.id = 0;
        this.posts = new ArrayList<>();
        this.memberships = new ArrayList<>();
        this.hiddenPosts = new HashSet<>();
        this.time = new Date();
    }
}