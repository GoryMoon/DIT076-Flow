package com.fgm.flow.core;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
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
    
    
    
    @OneToMany(mappedBy="poster", cascade = CascadeType.ALL)
    @Setter
    @Getter
    private List<Post> posts;
    
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
        timeStamp();
    }
}