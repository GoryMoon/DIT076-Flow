package com.fgm.flow.core;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
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
    //new ArrayList<>();
    
    /*
    public List<Post> getPosts()
    {
        return posts;
    }
    */
    
    public void addPost(Post post)
    {
        posts.add(post);
    }
   
    /* temp
    public void addUserGroup(Membership membership)
    {
        memberships.add(membership);
    }
    */
    
    public boolean isMemberOfGroup(UserGroup userGroup)
    {
        if(userGroup == null)
        {
            return false;
        }
        
        boolean isMember = false;
        
        for(Membership membership : memberships)
        {
            if(membership.getUserGroup().equals(userGroup))
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
    
    public final void timeStamp()
    {
        time = new Date();
    }
    
    public User(String email, String nick, String password)
    {
        this.id = 0;
        this.email = email;
        this.nick = nick;
        this.password = password;
        this.posts = new ArrayList<>();
        //this.memberships = new ArrayList<>();
        timeStamp();
    }
}