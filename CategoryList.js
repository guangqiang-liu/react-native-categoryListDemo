/**
 * Created by guangqiang on 2017/12/9.
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet, FlatList, SectionList, Dimensions} from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const CateData = require('./CategoryListData.json')

export default class CategoryList extends Component {

  constructor(props) {
    super(props)
    this._flatList = null
    this._sectionList = null
    this.state = {
      selectedRootCate: 0
    }
  }

  componentDidMount() {
    // 网络请求
  }

  renderNavBar() {
    return (
      <View style={{height: 64, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#F5F5F5', borderBottomWidth: 1}}>
        <Text style={{marginTop: 10}}>仿天猫商品分类页面</Text>
      </View>
    )
  }

  _renderItem = item => {
    let index = item.index
    let title = item.item.title
    return (
      <TouchableOpacity
        key={index}
        style={[{alignItems: 'center', justifyContent: 'center', width: 100, height: 44}, this.state.selectedRootCate === index ? {backgroundColor: '#F5F5F5', borderLeftWidth: 3, borderLeftColor: 'red'} : {backgroundColor: 'white'}]}
        onPress={() => {
          setTimeout(() => {
            (CateData.data.length - index) * 45 > height - 65 ? this._flatList.scrollToOffset({animated: true, offset: index * 45}) : null
            this._sectionList.scrollToLocation({itemIndex: 0, sectionIndex: 0, animated: true, viewOffset: 20})
          }, 100)
          this.setState({selectedRootCate: index})
        }}
      >
        <Text style={{fontSize: 13, color: this.state.selectedRootCate === index ? 'red' : '#333'}}>{title}</Text>
      </TouchableOpacity>
    )
  }

  renderRootCate() {
    let data = []
    CateData.data.map((item, index) => {
      data.push({key: index, title: item.firstCateName})
    })
    return (
      <View style={{backgroundColor: '#F5F5F5'}}>
        <FlatList
          ref={flatList => this._flatList = flatList}
          data={data}
          ListHeaderComponent={() => (<View/>)}
          ListFooterComponent={() => (<View/>)}
          ItemSeparatorComponent={() => <View style={{height:1, backgroundColor:'#F5F5F5'}}/>}
          renderItem={this._renderItem}
          onEndReachedThreshold={20}
          showsVerticalScrollIndicator={false}
          >
        </FlatList>
      </View>
    )
  }

  sectionComp(item) {
    return (
      <View style={{backgroundColor: '#F5F5F5', justifyContent: 'center'}}>
        <Text style={{color: 'gray', marginBottom: 8}}>{item.section.key}</Text>
      </View>
    )
  }

  renderCell(item, sectionIndex, index) {
    return (
      <TouchableOpacity
        key={index}
        style={{height: 110, width: (width - 140) / 3, backgroundColor: 'white', marginBottom: 8, marginRight: 10, alignItems: 'center'}}
        onPress={() => alert(`点击了第${sectionIndex}组中的第${index}个商品`)}
      >
        <Image style={{width: 60, height: 70, marginVertical: 10}} source={{uri: item.itemImg}}/>
        <Text style={{color: '#ccc', fontSize: 13}}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  renderItem(item) {
    let sectionIndex = item.section.data.sectionId
    let data = item.section.data
    return item.index === 0 ?
      <View key={item.index} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {data.map((cell, index) => this.renderCell(cell, sectionIndex, index))}
      </View> : null
  }

  renderItemCate() {
    let tempArr = CateData.data[this.state.selectedRootCate].secondCateItems.map((item, index) => {
      let tempObj = {}
      tempObj.key = item.secondCateName
      tempObj.data = item.items
      tempObj.data.sectionId = index
      return tempObj
    })
    return (
      <View style={{flex: 1, backgroundColor: '#F5F5F5', marginLeft: 10, marginTop: 8}}>
        <SectionList
          ref={(ref) => this._sectionList = ref}
          renderSectionHeader={this.sectionComp}
          renderItem={(data) => this.renderItem(data)}
          sections={tempArr}
          ItemSeparatorComponent={() => <View/>}
          ListHeaderComponent={() => <View/>}
          ListFooterComponent={() => <View/>}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => 'key' + index + item}
        />
      </View>
    )
  }

  renderCategory() {
    return (
      <View style={{flexDirection: 'row', flex: 1, backgroundColor: '#F5F5F5'}}>
        {this.renderRootCate()}
        {this.renderItemCate()}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNavBar()}
        {this.renderCategory()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})