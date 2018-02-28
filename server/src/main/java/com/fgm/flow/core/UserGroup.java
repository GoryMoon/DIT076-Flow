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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * A Flow user
 *
 * @author fgm
 */
@NoArgsConstructor
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(
        name="usergroup",
        uniqueConstraints = @UniqueConstraint(columnNames={"name"})
)
public class UserGroup implements Serializable
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
    private String name;
    

    @ManyToOne
    @JoinColumn(name="OWNER")   
    @Getter
    @Setter
    private User owner;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    @Expose
    private Date time;
    
    @OneToMany(mappedBy="userGroup", cascade = CascadeType.ALL)
    @Setter
    @Getter
    private List<Post> posts;
    
    public void addPost(Post post)
    {
        posts.add(post);
    }
    
    public UserGroup(String name, User owner)
    {
        this.id = 0;
        this.name = name;
        this.owner = owner;
        this.posts = new ArrayList<>();
        this.time = new Date();
    }
}